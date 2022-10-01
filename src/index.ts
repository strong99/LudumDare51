import { Application, Container } from 'pixi.js'
import { GameViewService } from './views/gameViewService';

const canvas = document.getElementById("pixi-canvas") as HTMLCanvasElement;
const app = new Application({
	view: canvas,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: window.innerWidth,
	height: window.innerHeight
});

const targetPanel =  document.getElementById("pixi-content");
if (targetPanel) app.resizeTo = targetPanel;

const mainLayer = new Container();
app.stage.addChild(mainLayer);

const  gameViewService = new GameViewService(app);

app.ticker.add((time)=>{
	gameViewService.update(time);
});