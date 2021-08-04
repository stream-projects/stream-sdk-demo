import styled, { keyframes } from 'styled-components';

const loadingPeriodsAnimation = keyframes`
    0%, 20% {
        color: rgba(0,0,0,0);
        text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);}
    40% {
        color: white;
        text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);}
    60% {
        text-shadow:
        .25em 0 0 white,
        .5em 0 0 rgba(0,0,0,0);}
    80%, 100% {
        text-shadow:
        .25em 0 0 white,
        .5em 0 0 white
    }
`;
export const LoadingPeriods = styled.p`
    &:after {
        content: ' .';
        animation: ${loadingPeriodsAnimation} 1.75s steps(5, end) infinite;
    }
`;
