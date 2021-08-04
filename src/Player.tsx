import { useEffect, useState } from 'react';
import { VideoJS } from './components/VideoJs';
import { getLiveStream } from 'stream-sdk';
import styled from 'styled-components';

const StyledPlayer = styled.div`
    .video-js {
        width: 1280px;
        height: 720px;
    }
`;

export const Player = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const liveStreamId = urlParams.get('liveStreamId');
    const [liveStream, setLiveStream] = useState(null);

    if (!liveStreamId) {
        alert('Missing liveStreamId');
    }

    useEffect(() => {
        if (liveStreamId) {
            getLiveStream(liveStreamId).then((response) => {
                setLiveStream(response);
            });
        }
    }, [liveStreamId]);

    if (!liveStream) {
        return <h2>Loading</h2>;
    }
    const videoJsOptions = {
        controls: true,
        autoplay: true,
        muted: true,
        liveui: true,
        bigPlayButton: false,
        controlBar: {
            children: [
                'playToggle',
                'liveDisplay',
                'volumePanel',
                'pictureInPictureToggle',
                'fullscreenToggle',
            ],
        },
        src: liveStream.playback,
        post: liveStream.thumbnail,
    };

    return (
        <StyledPlayer>
            <VideoJS options={videoJsOptions} />
        </StyledPlayer>
    );
};
