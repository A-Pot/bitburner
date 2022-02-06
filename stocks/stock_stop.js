/** @param {NS} ns **/
export async function main(ns) {

	// Kill all running stock_hold_one.js scripts
	ns.scriptKill('/stocks/stock_hold_one.js', 'home');

}