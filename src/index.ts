import { Application, Container } from 'pixi.js'
import { GameViewService } from './views/gameViewService';

const canvas = document.getElementById("pixi-canvas") as HTMLCanvasElement;
const app = new Application({
	view: canvas,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0xd2f5f8,
	width: window.innerWidth,
	height: window.innerHeight
});

const targetPanel =  document.getElementById("pixi-content");
if (targetPanel) app.resizeTo = targetPanel;

const mainLayer = new Container();
app.stage.addChild(mainLayer);

const  gameViewService = new GameViewService(app);

app.ticker.add((time)=>{
	let t = app.ticker.elapsedMS;
	if (t > 32) t = 16;
	gameViewService.update(t);
});