/** @param {NS} ns **/

// Purchase as many servers as possible with the maximum allowed RAM size.
// Name them with the prefix of 'srv', followed by a number
const MAX_SERVER_SIZE = 2 ** 20;
const SERVER_PREFIX = 'srv';

// Files to copy to the server after purchase
const FILES = ['hack_one.js', 'hack_all.js'];

// Returns true if the player has enough funds to purchase the server
function canPlayerAffordServer(ns) {
	return ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(MAX_SERVER_SIZE);
}

export async function main(ns) {

	// Loop through the possible server purchases
	for (let i = 1; i < 26; i++) {

		// The name of the server under consideration
		const server_name = SERVER_PREFIX + i;

		// If it doesn't exist, then consider buying it
		if (!ns.serverExists(server_name)) {

			// Attempt to purchase if enough funds are available to do so
			if (canPlayerAffordServer(ns)) {
				ns.purchaseServer(server_name, MAX_SERVER_SIZE);

				// After purchase, copy software to new server				
				await ns.scp(FILES, 'home', server_name);
			}

			// Else, can't afford another server, so stop
			else {
				break
			}
		}
	} // end for
} // end main