import { map } from "rxjs/operators";

import {
  getBroadcastFlow,
  printMessage,
  getNumbersFlow,
  asBroadcast,
  specificWait,
  asReplayBroadcast,
} from "./utils";

class Application {
  static start() {
    const number$ = asReplayBroadcast(
      getNumbersFlow(10).pipe(map((n) => (n + 1) * 10))
    );

    number$.subscribe({
      next: (n) => {
        printMessage("Reactive tick #1: " + n);
      },
      complete: () => {
        printMessage("Flow completed #1");
      },
    });

    specificWait(5000).then(() => {
      number$.subscribe({
        next: (n) => {
          printMessage("Reactive tick #2: " + n);
        },
        complete: () => {
          printMessage("Flow completed #2");
        },
      });
    });
  }
}

Application.start();
