/** @param {NS} ns **/
export async function main(ns) {

	// Args -- Desired: level, ram, cores for all current nodes
	// If the latter one or two are unspecified, set to the values of the first node

	// The time to wait before retrying if not enough funds are available for the requested upgrades
	const RETRY_TIME = 1000; 
	const NUM_ARGS = ns.args.length;

	if (NUM_ARGS == 0) {
		var target_level = ns.hacknet.getNodeStats(0).level;
		var target_ram = ns.hacknet.getNodeStats(0).ram;
		var target_cores = ns.hacknet.getNodeStats(0).cores;
	}

	else if (NUM_ARGS == 1) {
		var target_level = ns.args[0];
		var target_ram = ns.hacknet.getNodeStats(0).ram;
		var target_cores = ns.hacknet.getNodeStats(0).cores;
	}

	else if (NUM_ARGS == 2) {
		var target_level = ns.args[0];
		var target_ram = ns.args[1];
		var target_cores = ns.hacknet.getNodeStats(0).cores;
	}

	else { //NUM_ARGS == 3
		var target_level = ns.args[0];
		var target_ram = ns.args[1];
		var target_cores = ns.args[2];
	}

	// Iterate over all nodes
	for (var i = 0; i < ns.hacknet.numNodes(); i++) {

		ns.print("Considering hacknet node for upgrade: " + i);

		// Snapshot of node's current stats
		var current_level = ns.hacknet.getNodeStats(i).level;
		var current_ram = ns.hacknet.getNodeStats(i).ram;
		var current_cores = ns.hacknet.getNodeStats(i).cores;

		// TODO: Could refactor this since the logic is similar for the 3 properties

		// Upgrade levels
		while (current_level < target_level) {

			// The desired number of levels to upgrade
			let level_delta = target_level - current_level;

			// The costs associated with upgrading
			let upgrade_desired_level_cost = ns.hacknet.getLevelUpgradeCost(i, level_delta);
			let upgrade_one_level_cost = ns.hacknet.getLevelUpgradeCost(i, 1);
			
			// Check if we have the funds to directly upgrade to the desired level
			if (upgrade_desired_level_cost < ns.getServerMoneyAvailable('home')) {
				ns.hacknet.upgradeLevel(i, level_delta);
			}

			// If not, try to incrementally upgrade towards the goal
			else if (upgrade_one_level_cost < ns.getServerMoneyAvailable('home')) {
				ns.hacknet.upgradeLevel(i, 1);
			}

			// If we can't do that, then wait until more funds accumulate
			else {
				await ns.sleep(RETRY_TIME);
			}

			// Update current_level
			current_level = ns.hacknet.getNodeStats(i).level;

		}

		// Upgrade RAM
		while (current_ram < target_ram) {

			// The desired number of levels to upgrade
			let ram_delta = target_ram - current_ram;

			// The costs associated with upgrading
			let upgrade_desired_level_cost = ns.hacknet.getRamUpgradeCost(i, ram_delta);
			let upgrade_one_level_cost = ns.hacknet.getRamUpgradeCost(i, 1);

			// Check if we have the funds to directly upgrade to the desired level
			if (upgrade_desired_level_cost < ns.getServerMoneyAvailable('home')) {
				ns.hacknet.upgradeRam(i, ram_delta);
			}

			// If not, try to incrementally upgrade towards the goal
			else if (upgrade_one_level_cost < ns.getServerMoneyAvailable('home')) {
				ns.hacknet.upgradeRam(i, 1);
			}

			// If not, wait until more funds accumulate
			else {
				await ns.sleep(RETRY_TIME);
			}

			// Update current_level
			current_ram = ns.hacknet.getNodeStats(i).ram;

		}

		// Upgrade Cores
		while (current_cores < target_cores) {

			// The desired number of levels to upgrade
			let cores_delta = target_cores - current_cores;

			// The costs associated with upgrading
			let upgrade_desired_level_cost = ns.hacknet.getCoreUpgradeCost(i, cores_delta);
			let upgrade_one_level_cost = ns.hacknet.getCoreUpgradeCost(i, 1);

			// Check if we have the funds to directly upgrade to the desired level
			if (upgrade_desired_level_cost < ns.getServerMoneyAvailable('home')) {
				ns.hacknet.upgradeCore(i, cores_delta);
			}

			// If not, try to incrementally upgrade towards the goal
			else if (upgrade_one_level_cost < ns.getServerMoneyAvailable('home')) {
				ns.hacknet.upgradeCore(i, 1);
			}

			// If not, wait until more funds accumulate
			else {
				await ns.sleep(RETRY_TIME);
			}

			// Update current_level
			current_cores = ns.hacknet.getNodeStats(i).cores;

		}
	} // end for
} // end main