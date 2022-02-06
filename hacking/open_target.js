/** @param {NS} ns **/
// Opens as many ports as possible and nuke target, in preparation for hacking
export async function main(ns) {

	// The target
	const target = ns.args[0];

	// Only procees if we don't yet have root access (i.e. this wasn't already run before on the target)
	if (!ns.hasRootAccess(target)) {

		// The number of open ports
		let num_ports_open = 0;

		// P0
		if (ns.fileExists('BruteSSH.exe', 'home')) {
			ns.brutessh(target);
			num_ports_open++;
		}

		// P1
		if (ns.fileExists('FTPCrack.exe', 'home')) {
			ns.ftpcrack(target);
			num_ports_open++;
		}

		// P2
		if (ns.fileExists('relaySMTP.exe', 'home')) {
			ns.relaysmtp(target);
			num_ports_open++;
		}

		// P3
		if (ns.fileExists('HTTPWorm.exe', 'home')) {
			ns.httpworm(target);
			num_ports_open++;
		}

		// P4
		if (ns.fileExists('SQLInject.exe', 'home')) {
			ns.sqlinject(target);
			num_ports_open++;
		}

		// Nuke, if possible
		if (num_ports_open >= ns.getServerNumPortsRequired(target)) {

			// Nuke
			ns.nuke(target);

			// Copy software to target
			const files = ['self_weaken.js', 'run_self_weaken.js'];
			await ns.scp(files, 'home', target);

			// If the target has enough RAM, then use it to continually weaken itself
			if (ns.getServerMaxRam(target) >= 4) {
				ns.exec('run_self_weaken.js', target, 1, target);
			}

		}
	} // end if root access
} // end main