/** @param {NS} ns **/

// All the servers in the game which have money to hack (I think)
// It would be nice is there was an ns function for this, but there isn't as far as I'm aware.
function getTargets() {

        let targets = [
                '4sigma',
                'aevum-police',
                'alpha-ent',
                'applied-energetics',
                'b-and-a',
                'blade',
                'catalyst',
                'clarkinc',
                'comptek',
                'crush-fitness',
                'defcomm',
                'deltaone',
                'ecorp',
                'foodnstuff',
                'fulcrumassets',
                'fulcrumtech',
                'galactic-cyber',
                'global-pharm',
                'harakiri-sushi',
                'helios',
                'hong-fang-tea',
                'icarus',
                'infocomm',
                'iron-gym',
                'joesguns',
                'johnson-ortho',
                'kuai-gong',
                'lexo-corp',
                'max-hardware',
                'megacorp',
                'microdyne',
                'millenium-fitness',
                'n00dles',
                'nectar-net',
                'neo-net',
                'netlink',
                'nova-med',
                'nwo',
                'omega-net',
                'omnia',
                'omnitek',
                'phantasy',
                'powerhouse-fitness',
                'rho-construction',
                'rothman-uni',
                'sigma-cosmetics',
                'silver-helix',
                'snap-fitness',
                'solaris',
                'stormtech',
                'summit-uni',
                'syscore',
                'taiyang-digital',
                'the-hub',
                'titan-labs',
                'unitalife',
                'univ-energy',
                'vitalife',
                'zb-def',
                'zb-institute',
                'zer0',
                'zeus-med'
        ];

        // Return sorted targets
        return (targets.sort((a, b) => a < b ? -1 : 1));

}

export async function main(ns) {

        // Make an array of 'home', plus purchased server names: home, srv1, srv2, ... srv25
        const servers = ['home']
        for (let i = 1; i < 26; i++) {
                let srv_i = 'srv' + i.toString();
                if (ns.serverExists(srv_i)) {
                        servers.push(srv_i);
                }
        }

        // Get targets
        let my_targets = getTargets();

        // Attempt to open all targets, and keep track of successful attempts, as well as whether the level is high enough to hack
        let hackable_targets = [];
        for (const t of my_targets) {
                ns.run('open_target.js', 1, t);
                if ((ns.hasRootAccess(t)) & (ns.getServerRequiredHackingLevel(t) <= ns.getHackingLevel())) {
                        hackable_targets.push(t);
                }
        }

        // Calculate the load from each hackable target
        // The weight is based on the level required to hack the target
        let loads = [];
        for (const h of hackable_targets) {
                const level = ns.getServerRequiredHackingLevel(h);
                loads.push({
                        'name': h,
                        'load': level
                });
        }

        // Sort objects according to load, such that the highest load is last (for pop)
        const sorted_loads = loads.sort((a, b) => a.load - b.load);

        // Init loads to home and purchased servers
        var server_loads = [];
        for (const s of servers) {
                server_loads.push({ 'server_name': s, targets: [], 'load': 0 });
        }

        // Allocate loads to servers
        while (sorted_loads.length > 0) {

                // Consider the current load for placement
                const current_load = sorted_loads.pop();

                // Sort the servers so that the least encumbered is first
                var server_loads = server_loads.sort((a, b) => a.load - b.load);

                // Place the load in the least encumbered server
                server_loads[0].load += current_load.load;
                server_loads[0].targets.push(current_load.name);

        }

        // Execute scripts with targets on servers
        for (const s of server_loads) {

                // Kill all currently active hacking scripts
                ns.scriptKill('hack_one.js', s.server_name);

                // Run the hacks on the targets
                ns.exec('hack_all.js', s.server_name, 1, s.targets.join());

        }
}