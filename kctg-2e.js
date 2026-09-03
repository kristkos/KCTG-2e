export const MODULE_ID = 'kctg-2e';

// 'show-warning' doubles as the run-once flag: the note posts while it is on, then
// turns itself off. Switching it back on in module settings shows it once more.
Hooks.once('init', () => {
    game.settings.register(MODULE_ID, 'show-warning', {
        name: 'Show "Thank you" note on startup',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean
    });

    // console: game.modules.get("kctg-2e").api.showWelcome()
    game.modules.get(MODULE_ID).api = { showWelcome: postWelcome };
});

// Define the 'setting' function
function setting(key) {
    return game.settings.get(MODULE_ID, key);
}

/** Post the welcome note to chat, whispered to the current GM. */
async function postWelcome() {
    const content = await foundry.applications.handlebars.renderTemplate(`modules/${MODULE_ID}/templates/notes.html`);
    return ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker(),
        content,
        whisper: [game.user.id]
    });
}

Hooks.once('ready', async () => {
    if (!game.user?.isGM || !setting("show-warning")) return;
    await game.settings.set(MODULE_ID, "show-warning", false);
    await postWelcome();
});

// Wire up the buttons inside that message
Hooks.on("renderChatMessageHTML", (message, html) => {
    for (const el of html.querySelectorAll(`[data-kctg-handler^="${MODULE_ID}|"]`)) {
        el.addEventListener("click", onKctgClick);
    }
});

function onKctgClick(event) {
    event.preventDefault();
    const [, action, ...args] = event.currentTarget.dataset.kctgHandler.split("|");
    if (action === "openWindow") window.open(args.join("|"), "_blank", "noopener");
}
