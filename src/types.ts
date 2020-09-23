export type CommandOptions = { [key: string]: string };

export enum VideoScale {
    xs = "100:360",
    sm = "320:180",
    md = "640:360",
    lg = "1280:720",
    xl = "2560:1440",
}

export interface VideoIteration {
    number: number;
    inputFilename: string;
    outputFilename: string;
    scale: VideoScale;
}
