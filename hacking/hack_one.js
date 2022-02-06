/** @param {NS} ns **/
export async function main(ns) {

    // The target to be hacked
    var target = ns.args[0];

    // The target's minimum security level
    const minSecurityLevel = ns.getServerMinSecurityLevel(target);

    // The maximum amount of money that can be on the server
    const maxMoneyAvailable = ns.getServerMaxMoney(target);

    // The target growth (80% of maximum growth number)
    const moneyTarget = 0.80 * maxMoneyAvailable;

    // The target security (within 20% of the minimum security level)
    const securityTarget = 1.20 * minSecurityLevel;

    // Hacking procedure:
    while (true) {

        // First, grow the server to a point where it's worth hacking
        while (ns.getServerMoneyAvailable(target) < moneyTarget) {
            await ns.grow(target);
        }

        // Then, weaken the security within the threshold, or at least down to 80
        while (ns.getServerSecurityLevel(target) > Math.min(80, securityTarget)) {
            await ns.weaken(target);
        }

        // Finally, attempt the hack until successful
        while (true) {
            let current_money = ns.getServerMoneyAvailable(target);
            await ns.hack(target);
            if (current_money > ns.getServerMoneyAvailable(target)) {
                break
            }
        }
    }
}