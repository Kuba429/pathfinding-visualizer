import { Wrapper } from "./Wrapper";
import "./styles/index.scss";

export const a = new Wrapper();
document.querySelector("#startButton")?.addEventListener("click", () => {
	a.interval = requestAnimationFrame(a.mainLoop);
});
