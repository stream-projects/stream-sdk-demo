import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createLiveStream, createToken, createAsset } from 'stream-sdk';
import styled from 'styled-components';

const Page = styled.div`
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 15%;
    width: 100%;
    input,
    select,
    button {
        margin-right: 0.5rem;
    }
`;

const demoAssets = [
    {
        type: 'BACKGROUND',
        attributes: {
            src: 'https://res.cloudinary.com/stream-studio/image/upload/v1626820525/am9v4jehbutjxddbwo6b.gif',
            height: 200,
            width: 200,
        },
    },
    {
        type: 'BACKGROUND',
        attributes: { color: 'rgb(0, 208, 132)' },
    },
    {
        type: 'LOGO_OVERLAY',
        attributes: {
            src: 'https://res.cloudinary.com/stream-studio/image/upload/v1627169610/pos65hfb9ijn1xpin6ae.gif',
            height: '250',
            width: '250',
        },
    },
    {
        type: 'VIDEO_OVERLAY',
        attributes: {
            videoUrl:
                'https://res.cloudinary.com/stream-studio/video/upload/v1622679692/ijfeynygc66m6ougdinh.mp4',
            thumbnailUrl:
                'https://res.cloudinary.com/stream-studio/video/upload/w_91,h_56,c_fill/v1622679692/ijfeynygc66m6ougdinh.jpg',
        },
    },
    {
        type: 'GRAPHIC_OVERLAY',
        attributes: {
            src: 'https://res.cloudinary.com/stream-studio/image/upload/v1615444931/bb01mjdv864unsgz7hgf.png',
            width: 1280,
            height: 720,
        },
    },
    {
        type: 'CAPTION_OVERLAY',
        attributes: {
            title: 'Welcome to Stream Club!',
            subtitle: "We can't wait to see what you build!",
        },
    },
];

export const Home = () => {
    const [token, setToken] = useState(null);
    const [liveStreamId, setLivestreamId] = useState(null);
    const [streamTokenId, setStreamTokenId] = useState(null);
    const [streamTokenSecret, setStreamTokenSecret] = useState(null);

    const createLiveStreamButton = async (e) => {
        e.preventDefault();
        const streamTokenId = (document.getElementById('streamTokenId') as any)
            .value;
        const streamTokenSecret = (
            document.getElementById('streamTokenSecret') as any
        ).value;
        const createdLiveStream = await createLiveStream(
            streamTokenId,
            streamTokenSecret,
        );
        setLivestreamId(createdLiveStream.id);
        setStreamTokenId(streamTokenId);
        setStreamTokenSecret(streamTokenSecret);

        const createdToken = await createToken(
            createdLiveStream.id,
            streamTokenId,
            streamTokenSecret,
            (document.getElementById('user_id') as any).value,
            (document.getElementById('user_name') as any).value,
            (document.getElementById('user_type') as any).value,
        );

        if ((document.getElementById('demo_assets') as any).checked) {
            for (let asset of demoAssets) {
                await createAsset(
                    createdLiveStream.id,
                    createdToken.token,
                    asset.attributes,
                    asset.type,
                );
            }
        }
        setToken(createdToken.token);
    };

    const accessLiveStreamButton = async (e) => {
        e.preventDefault();
        const streamTokenId = (document.getElementById('streamTokenId2') as any)
            .value;
        const streamTokenSecret = (
            document.getElementById('streamTokenSecret2') as any
        ).value;
        const livestreamId = (document.getElementById('liveStreamId') as any)
            .value;
        setLivestreamId(livestreamId);
        setStreamTokenId(streamTokenId);
        setStreamTokenSecret(streamTokenSecret);

        const createdToken = await createToken(
            livestreamId,
            streamTokenId,
            streamTokenSecret,
            (document.getElementById('user_id2') as any).value,
            (document.getElementById('user_name2') as any).value,
            (document.getElementById('user_type2') as any).value,
        );
        setToken(createdToken.token);
    };

    return (
        <Page>
            <Container>
                <h1>Stream Club Cloud SDK</h1>
                {(!liveStreamId || !token) && (
                    <>
                        <h3>
                            Before using this demo, we're going to need to
                            create a live stream and a token.
                        </h3>
                        <p>
                            Please enter your API credentials and token
                            information:
                        </p>
                        <div>
                            <input
                                id="streamTokenId"
                                placeholder="streamTokenId"
                            ></input>
                            <input
                                id="streamTokenSecret"
                                placeholder="streamTokenSecret"
                            ></input>
                            <input id="user_id" placeholder="User Id"></input>
                            <input
                                id="user_name"
                                placeholder="Username"
                            ></input>
                            <select id="user_type">
                                <option value="host">Host</option>
                                <option value="cohost">Cohost</option>
                            </select>
                            Create Demo Assets
                            <input
                                type="checkbox"
                                id="demo_assets"
                                defaultChecked={true}
                            ></input>
                            <button onClick={createLiveStreamButton}>
                                Create
                            </button>
                        </div>
                        <p>
                            If you've already created a live stream, you can
                            access it using the id here:
                        </p>
                        <div>
                            <input
                                id="streamTokenId2"
                                placeholder="streamTokenId"
                            ></input>
                            <input
                                id="streamTokenSecret2"
                                placeholder="streamTokenSecret"
                            ></input>
                            <input id="user_id2" placeholder="User Id"></input>
                            <input
                                id="user_name2"
                                placeholder="Username"
                            ></input>
                            <select id="user_type2">
                                <option value="host">Host</option>
                                <option value="cohost">Cohost</option>
                            </select>

                            <input
                                id="liveStreamId"
                                placeholder="liveStreamId"
                            ></input>
                            <button onClick={accessLiveStreamButton}>
                                Access
                            </button>
                        </div>
                    </>
                )}
                {token && (
                    <>
                        <h3>Navigation</h3>
                        <ul>
                            <li>
                                <Link
                                    to={`/host?token=${token}&liveStreamId=${liveStreamId}&streamTokenId=${streamTokenId}&streamTokenSecret=${streamTokenSecret}`}
                                >
                                    Host Studio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={`/cohost?token=${token}&liveStreamId=${liveStreamId}`}
                                >
                                    Cohost Studio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={`/player?liveStreamId=${liveStreamId}`}
                                >
                                    Player
                                </Link>
                            </li>
                        </ul>
                    </>
                )}
            </Container>
        </Page>
    );
};
