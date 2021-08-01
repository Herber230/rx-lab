import { Observable, ReplaySubject, Subject } from "rxjs";

const MAX = 3000;
const MIN = 1000;

export const getRandomTime = () => Math.random() * (MAX - MIN) + MIN;

export const printMessage = (message: string) => {
  const currentTime = new Date();
  const time = `${currentTime.getMinutes()}:${currentTime.getSeconds()}:${currentTime.getMilliseconds()}`;
  console.log(`[>] ${time} -- ${message}`);
};

export const randomWait = () =>
  new Promise<void>((resolve, reject) => setTimeout(resolve, getRandomTime()));

export const specificWait = (millis: number) =>
  new Promise<void>((resolve, reject) => setTimeout(resolve, millis));


export const getFlow = (timeLimit: number) =>
  new Observable<void>((observer) => {
    const intervalId = setInterval(() => {
      printMessage("Tick inside source");
      observer.next();
    }, getRandomTime());

    setTimeout(() => {
      clearInterval(intervalId);
      observer.complete();
    }, timeLimit);
  });

export const getBroadcastFlow = (timeLimit: number) => {
  const source = getFlow(timeLimit);
  const subject = new Subject<void>();
  source.subscribe(subject);

  return subject;
};

export const getNumbersFlow = (limit: number) =>
  new Observable<number>((observer) => {
    const numberList = Array.from(Array(limit).keys());
    const intervalId = setInterval(() => {
      if (numberList.length > 0) {
        observer.next(numberList.shift());
      } else {
        clearTimeout(intervalId);
        observer.complete();
      }
    }, 1000);
  });

export function asBroadcast<T>(source: Observable<T>) {
  const subject = new Subject<T>();
  source.subscribe(subject);
  return subject;
}

export function asReplayBroadcast<T>(source: Observable<T>) {
  const subject = new ReplaySubject<T>();
  source.subscribe(subject);
  return subject;
}