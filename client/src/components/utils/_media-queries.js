import { css } from 'styled-components';

const sizes = {
    huge: 1600,
    searchLarge: 1400,
    laptop: 1200,
    searchMedium: 730,
    tablet: 640,
    mobile: 320
}

export const media = Object.keys(sizes).reduce((accumulator, label) => {
    const pxSize = sizes[label]
    accumulator[label] = (...args) => css `
    @media (max-width: ${pxSize}px) {
      ${css(...args)};
    }
  `
    return accumulator
}, {})