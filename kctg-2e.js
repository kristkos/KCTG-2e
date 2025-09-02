import {Notes} from "./apps/notes.js";
export const MODULE_ID = 'kctg-2e';
Hooks.once('init', () => {
    game.settings.register(MODULE_ID, 'show-warning', {
        name: 'Show "Thank you" note on startup',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean
    });
});
function setting(key) {
    return game.settings.get(MODULE_ID, key);
}
Hooks.once('ready', () => {
    if (setting("show-warning") && game.user?.isGM) {
        new Notes().render(true);
    }
});

