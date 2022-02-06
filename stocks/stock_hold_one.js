/** @param {NS} ns **/

// Threshold for what forecast probability we're willing to tolerate to buy at
const MIN_BUY_PROB = 0.55;

// Threshold for what forecast probability we're willing to hold at
const MIN_HOLD_PROB = 0.51;

// How long to wait for the stock tick
const TICK_WAIT = 6000;

// Commission fee
const COMISSION = 10 ** 5;


// Function to buy and hold a single stock
async function buynhold(ns, sbl) {

	// Create initial stonk object
	var st = {
		"symb": sbl,
		"holding": false,
		"num_shares": 0,
	}

	// Watch indefinitely
	while (true) {

		// Get the stock's forecast and whether it's good
		var current_forecast = ns.stock.getForecast(st.symb);
		var stock_above_buy_threshold = (current_forecast > MIN_BUY_PROB);
		var stock_above_hold_threshold = (current_forecast > MIN_HOLD_PROB);

		// If we're holding and it's bad, time to sell
		if (st.holding == true & !stock_above_hold_threshold) {
			ns.stock.sell(st.symb, st.num_shares);
			ns.print(`Selling ${st.num_shares} shares of ${st.symb}`);
			st.holding = false;
		}

		// If we're not holding and it's good, time to buy (as much as possible)
		if (st.holding == false & stock_above_buy_threshold) {
			var mymoney = ns.getServerMoneyAvailable('home');
			var ticker_price = ns.stock.getAskPrice(st.symb);
			var tot_shares = Math.min(
				ns.stock.getMaxShares(st.symb),
				Math.floor(Math.max(0, (mymoney - COMISSION) / ticker_price))
			);
			ns.stock.buy(st.symb, tot_shares);
			ns.print(`Buying ${tot_shares} shares of ${st.symb}`);
			st.holding = true;
			st.num_shares = tot_shares;
		}

		// Else, just await the next tick (hold or wait to buy)
		await ns.sleep(TICK_WAIT);

	} // end while true	

} // end buynhold

// Main
export async function main(ns) {

	// No need to print sleeps
	ns.disableLog('sleep');

	// Buy and hold object
	await buynhold(ns, ns.args[0]);

} // end main