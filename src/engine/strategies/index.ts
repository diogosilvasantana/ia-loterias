export * from './SumStrategy';
export * from './ParityStrategy';
export * from './FrameStrategy';
export * from './DeltaStrategy';

import { SumStrategy } from './SumStrategy';
import { ParityStrategy } from './ParityStrategy';
import { FrameStrategy } from './FrameStrategy';
import { DeltaStrategy } from './DeltaStrategy';

// Default list of all strategies
export const ALL_STRATEGIES = [
    SumStrategy,
    ParityStrategy,
    FrameStrategy,
    DeltaStrategy
];
