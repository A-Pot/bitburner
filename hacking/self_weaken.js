/** @param {NS} ns **/
// This is just a quick and easy function to run to burn up a target's RAM
// Better to have it run something than nothing, and weaken has no downside.
export async function main(ns) {
	while (true) {
		await ns.weaken(ns.getHostname());
	}
}