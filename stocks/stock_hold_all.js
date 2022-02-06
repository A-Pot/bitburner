/** @param {NS} ns **/
function getInitStockList(ns) {

	// Declare an array of all stonks and their initial statuses
	let stonks = [];
	const all_symbols = ns.stock.getSymbols();
	for (const s of all_symbols) {
		stonks.push(s);
	}

	return stonks;

}

export async function main(ns) {

	// No need to print sleeps
	ns.disableLog('sleep');

	// Get the list of stocks with initial conditions
	const stonks = getInitStockList(ns);

	// Since we cannot await on Promise.all, like this:
	//await Promise.all([
	//	buynhold(ns, stonks[1]),
	//	buynhold(ns, stonks[2]),
	//	buynhold(ns, stonks[3])
	//]);

	// We will run a separate script for each of stonks
	for (const s of stonks) {
		ns.run('stocks/stock_hold_one.js', 1, s);
	}

} // end main