import {
    Studio,
    useSocket,
    startLiveStream,
    stopLiveStream,
    getLiveStream,
} from 'stream-sdk';
import styled from 'styled-components';
import { Assets } from './components/Assets';
import { VideoControls } from './components/VideoControls';
import { Participants } from './components/Participants';
import { useEffect, useState } from 'react';
import { LoadingPeriods } from './components/LoadingPeriods';

const Page = styled.div`
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
`;

const Container = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    min-width: 60vw;
    border-radius: 10px;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    position: relative;
`;
const VideoBox = styled.div`
    position: relative;
    border-radius: 10px 10px 0px 0px;
    padding-top: 56.25%;
    max-width: 100%;
    max-height: 100%;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
`;
const PrimaryButton = styled.button`
    background: #704cf1;
    border: 0;
    border-radius: 4px;
    color: white;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.75rem;
    width: 100%;
    transition: 0.2s ease;

    &:hover {
        opacity: 0.9;
    }
`;

const SecondaryButton = styled.button`
    background: #f14ca7;
    border: 0;
    border-radius: 4px;
    color: white;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.75rem;
    width: 100%;
    transition: 0.2s ease;

    &:hover {
        opacity: 0.9;
    }
`;

const RightColumn = styled.div`
    padding: 0 1rem;
    width: 250px;

    overflow: auto;
`;
const AssetContainer = styled.div`
    margin-top: 0.5rem;
`;

export const Host = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const liveStreamId = urlParams.get('liveStreamId');
    const token = urlParams.get('token');
    const { socket } = useSocket();
    const [isLoading, setIsLoading] = useState(false);
    const [isLive, setIsLive] = useState(false);

    // In production, you should never pass these credentials to the client side!
    const streamTokenId = urlParams.get('streamTokenId');
    const streamTokenSecret = urlParams.get('streamTokenSecret');

    if (!liveStreamId || !token) {
        alert('Missing liveStreamId or token');
    }

    useEffect(() => {
        if (!socket) return;
        socket.on('broadcast-started', (data) => {
            if (data && data.error) {
                console.error(data);
                return;
            }
            setIsLive(true);
            setIsLoading(false);
            console.log(`Broadcast started!`);
        });
        socket.on('broadcast-ended', (data) => {
            if (data && data.error) {
                console.error(data);
                return;
            }
            setIsLive(false);
            setIsLoading(false);
            console.log(`Broadcast ended!`);
        });

        return () => {
            socket.off('broadcast-started');
            socket.off('broadcast-ended');
        };
    }, [socket]);

    useEffect(() => {
        getLiveStream(liveStreamId)
            .then((liveStream) => {
                setIsLive(liveStream.live);
            })
            .catch((error) => console.error(error));
    }, []);

    const goLive = async () => {
        await startLiveStream(liveStreamId, streamTokenId, streamTokenSecret);
        setIsLoading(true);
    };

    const endStream = async () => {
        await stopLiveStream(liveStreamId, streamTokenId, streamTokenSecret);
        setIsLoading(true);
    };

    return (
        <Page>
            <Container>
                <VideoBox>
                    <Studio
                        initialLayout="customise"
                        showNames={true}
                        liveStreamId={liveStreamId}
                        token={token}
                    />
                </VideoBox>
                <VideoControls></VideoControls>
                <Participants></Participants>
            </Container>

            <RightColumn>
                {!isLive && (
                    <PrimaryButton onClick={goLive} disabled={isLoading}>
                        {!isLoading ? 'Go Live' : 'Starting'}
                        {isLoading && <LoadingPeriods />}
                    </PrimaryButton>
                )}
                {isLive && (
                    <SecondaryButton onClick={endStream} disabled={isLoading}>
                        {!isLoading ? 'Stop Livestream' : 'Stopping'}
                        {isLoading && <LoadingPeriods />}
                    </SecondaryButton>
                )}
                {isLive && (
                    <a
                        href={`/player?liveStreamId=${liveStreamId}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        View Player
                    </a>
                )}
                <AssetContainer>
                    <Assets liveStreamId={liveStreamId} token={token}></Assets>
                </AssetContainer>
            </RightColumn>
        </Page>
    );
};

export default Host;
