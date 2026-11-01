export const THEME_KEY = "theme";

/** Runs in <head> before first paint so a saved dark choice never flashes light. */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;
