/** @param {NS} ns **/
// Calculate the amount of threads we can use for self_weaken.js on this host
export async function main(ns) {

	const script_name = 'self_weaken.js';
	const this_host = ns.getHostname();

	// Calculate the maximum number of threads that can be used to run the script 
	let free_ram = ns.getServerMaxRam(this_host) - ns.getScriptRam('run_self_weaken.js');
	let script_ram = ns.getScriptRam(script_name, this_host);
	let max_num_threads = Math.max(1, Math.floor(free_ram / script_ram));

	// Start weaken loop
	ns.run('self_weaken.js', max_num_threads);

}