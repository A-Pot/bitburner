/** @param {NS} ns **/
export async function main(ns) {

    // Where this is running (e.g. intended for home or a large server)
    const this_host = ns.getHostname();

    // Need to unpack targets from single, comma-separated string arg
    const targets = ns.args[0].split(',');

    // How much ram the hack script costs
    const ram_cost = ns.getScriptRam('hack_one.js');

    // The amount of RAM to spend, with a little set aside for running other things
    const ram_set_aside = 2;
    const ram_for_hacking = ns.getServerMaxRam(this_host) - ns.getServerUsedRam(this_host) - ram_set_aside;

    // How many total threads can be expended
    const tot_threadpool = Math.floor(ram_for_hacking / ram_cost);

    // Calculate the hacking levels of each target
    let target_levels = [];
    for (const t of targets) {
        target_levels.push(ns.getServerRequiredHackingLevel(t));
    }

    // Calculate the total hacking levels
    const hacking_level_sum = target_levels.reduce((a, b) => a + b);

    // Run script for each target with number of threads allocated
    // based on the hacking level distribution of all targets
    for (const t of targets) {
        let hacking_level = ns.getServerRequiredHackingLevel(t);
        let thread_prop = (hacking_level / hacking_level_sum);
        let num_threads = Math.floor(thread_prop * tot_threadpool);

        ns.run('hack_one.js', num_threads, t);
    }

}