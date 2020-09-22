export type CommandOptions = { [key: string]: string };

export enum VideoScale {
    xs = "100:360",
    sm = "640:360",
}

export interface VideoIteration {
    number: number;
    inputFilename: string;
    outputFilename: string;
    scale: VideoScale;
}
