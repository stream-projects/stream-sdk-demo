import { Studio } from 'stream-sdk';
import styled from 'styled-components';
import { VideoControls } from './components/VideoControls';

const Page = styled.div`
    display: flex;
    flex-direction: row;
    width: 70%;
`;

const Container = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    width: 100%;
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

export const Cohost = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const liveStreamId = urlParams.get('liveStreamId');
    const token = urlParams.get('token');

    if (!liveStreamId || !token) {
        alert('Missing liveStreamId or token');
    }

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
            </Container>
        </Page>
    );
};

export default Cohost;
