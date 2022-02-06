/** @param {NS} ns **/
export async function main(ns) {

	// Kill all running scripts on home
	ns.scriptKill('hack_one.js', 'home');

	// Kill all running scripts on servers srv1, ... , srv25	
	for (let i = 1; i < 26; i++) {
		const server_name = 'srv' + i;
		if (ns.serverExists(server_name)) {
			ns.scriptKill('hack_one.js', server_name);
		}
	}
}