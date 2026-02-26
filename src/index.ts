import "../web/style/game.css";
import {Engine} from "./engine/core/Engine";
import {InputManager} from "@engine/managers/InputManager";

import {NftTubeGame} from "./games/NftTube/NftTubeGame";

window.onload = async () => {
    const canvas = document.getElementById("viewport") as HTMLCanvasElement;
    const gameArea = document.getElementById("gameArea") as HTMLDivElement;

    if(!canvas || !gameArea) {console.error("Canvas or Game Area no found"); return;}

    try
    {
        InputManager.initialize();

        const game = new NftTubeGame(gameArea);
        const engine = new Engine(canvas, gameArea, game);

        await engine.start();
    }
    catch(error)
    {
        console.error("Failed to start game engine:", error);
    }
};

window.onerror = (message, source, lineno, colno, error) => {
    console.error(`Message: ${message}`);
    console.error(`Source: ${source}`);
    console.error(`Line: ${lineno}, Column ${colno}`);
    console.error(`Error`, error);
};
