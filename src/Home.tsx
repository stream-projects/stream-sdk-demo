import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createLiveStream, createToken, createAsset } from 'stream-sdk';
import styled from 'styled-components';

const Page = styled.div`
    font-family: Inter, Arial, sans-serif;
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    padding: 2rem 3rem;
`;
const SectionContainer = styled.div`
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1.5rem 0rem;
    width: 100%;
`;
const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 200px;
    width: 400px;
`;
const InputLabel = styled.div`
    font-weight: 700;
    margin-left: 0.25em;
    margin-bottom: 0.35em;
`;
const Input = styled.input`
    background: #f6f8fa;
    border: 0;
    border: 1px solid  #f6f8fa;
    border-radius: 3px;
    font-size: 16px;
    padding: 0.75em;

    &::placeholder {
        color: black;
        opacity: 1;
    }
`;
const InputDesc = styled.div`
    font-size: 14px;
    margin-top: 0.25em;
    margin-bottom: 1.5em;
    margin-left: 0.25em;
    line-height: 1.5;
`;
const Select = styled.select`
background: #f6f8fa;
border: 0;
    border: 1px solid #f6f8fa;;
    border-radius: 3px;
    font-size: 16px;
    padding: 0.5em;
`;
const CreateDemoAssetsDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 16px;
    margin-top: 0.5em;
    padding: 0.5em;
    padding-right: 0;
`;
const InputCheckbox = styled.input`
    border: 2px solid black;
    font-size: 16px;
    margin-left: 0.5em;
`;
const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;

    width: 100%;
`;
const Button = styled.button`
    background: #704cf1;
    border: 0;
    border-radius: 3px;
    cursor: pointer;
    color: white;
    display: inline;
    font-size: 16px;
    font-weight: 700;
    margin-top: 0.5rem;
    padding: 0.65em 1.25em;
`;
const NavContainer = styled.div`
    display: flex;
    border: 1px solid #704cf1;
    border-radius: 3px;
    overflow: hidden;
`;
interface NavProps {
    active?: boolean;
}
const Nav = styled.div<NavProps>`
    background: ${(props) => (props.active ? '#704cf1' : 'white')};
    color: ${(props) => (props.active ? 'white' : '#704cf1')};
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    padding: 1em 1.5em;
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
    const [nav, setNav] = useState('livestream');

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

                        <NavContainer>
                            <Nav
                                active={nav === 'livestream'}
                                onClick={() => setNav('livestream')}
                            >
                                Create a live stream
                            </Nav>
                            <Nav
                                active={nav === 'token'}
                                onClick={() => setNav('token')}
                            >
                                Use existing live stream
                            </Nav>
                        </NavContainer>

                        {nav === 'livestream' && (
                            <>
                                <SectionContainer>
                                    <p style={{marginBottom: '1.5em'}}>
                                        Please enter your API credentials and token
                                        information:
                                    </p>

                                    <InputsContainer>
                                        <InputLabel>
                                            Stream TokenID
                                        </InputLabel>
                                        <Input
                                            id="streamTokenId"
                                        />
                                        <InputDesc>
                                        Your Stream Club Cloud API key
                                        </InputDesc>

                                        <InputLabel>
                                            Stream Token Secret
                                        </InputLabel>
                                        <Input
                                            id="streamTokenSecret"
                                        />
                                        <InputDesc>
                                        Your Stream Club Cloud API secret. Please don’t commit code with this!
                                        </InputDesc>

                                        <InputLabel>
                                            User ID
                                        </InputLabel>
                                        <Input
                                            id="user_id"
                                        />
                                        <InputDesc>
                                        A user id to identify the user in your application. Can be any string.
                                        </InputDesc>

                                        <InputLabel>
                                            Username
                                        </InputLabel>
                                        <Input
                                            id="user_name"
                                        />
                                        <InputDesc>
                                        A display name for your user. Used in the UI.
                                        </InputDesc>

                                        <InputLabel>
                                            Host
                                        </InputLabel>
                                        <Select id="user_type">
                                            <option value="host">Host</option>
                                            <option value="cohost">
                                                Cohost
                                            </option>
                                        </Select>
                                        <InputDesc>
                                        User type. A host will have write access to the livestream while cohosts will only have read access.
                                        </InputDesc>

                                        <CreateDemoAssetsDiv>
                                            Create Demo Assets
                                            <InputCheckbox
                                                type="checkbox"
                                                id="demo_assets"
                                                defaultChecked={true}
                                            />
                                        </CreateDemoAssetsDiv>

                                        <ButtonContainer>
                                            <Button
                                                onClick={createLiveStreamButton}
                                            >
                                                Create
                                            </Button>
                                        </ButtonContainer>
                                    </InputsContainer>
                                </SectionContainer>
                            </>
                        )}
                        {nav === 'token' && (
                            <>
                                <SectionContainer>
                                    <p style={{marginBottom: '1.5em'}}>
                                        Please enter your API credentials and token
                                        information:
                                    </p>
                                    <InputsContainer>
                                    <InputLabel>
                                            Stream TokenID
                                        </InputLabel>
                                        <Input
                                            id="streamTokenId2"
                                        />
                                        <InputDesc>
                                        Your Stream Club Cloud API key
                                        </InputDesc>

                                        <InputLabel>
                                            Stream Token Secret
                                        </InputLabel>
                                        <Input
                                            id="streamTokenSecret2"
                                        />
                                        <InputDesc>
                                        Your Stream Club Cloud API secret. Please don’t commit code with this!
                                        </InputDesc>

                                        <InputLabel>
                                            User ID
                                        </InputLabel>
                                        <Input
                                            id="user_id2"
                                        />
                                        <InputDesc>
                                        A user id to identify the user in your application. Can be any string.
                                        </InputDesc>

                                        <InputLabel>
                                            Username
                                        </InputLabel>
                                        <Input
                                            id="user_name2"
                                        />
                                        <InputDesc>
                                        A display name for your user. Used in the UI.
                                        </InputDesc>

                                        <InputLabel>
                                            Livestream ID
                                        </InputLabel>
                                        <Input
                                            id="liveStreamId"
                                        />
                                        <InputDesc>
                                        The ID of a live stream created via the API
                                        </InputDesc>

                                        <InputLabel>
                                            Host
                                        </InputLabel>
                                        <Select id="user_type2">
                                            <option value="host">Host</option>
                                            <option value="cohost">
                                                Cohost
                                            </option>
                                        </Select>
                                        <InputDesc>
                                        User type. A host will have write access to the livestream while cohosts will only have read access.
                                        </InputDesc>

                                        <ButtonContainer>
                                            <Button
                                                onClick={accessLiveStreamButton}
                                            >
                                                Access
                                            </Button>
                                        </ButtonContainer>
                                    </InputsContainer>
                                </SectionContainer>
                            </>
                        )}
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
