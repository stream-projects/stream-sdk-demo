import { useEffect, useState } from 'react';
import { useCall } from 'stream-sdk';
import styled from 'styled-components';

const VideoControlsContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    font-family: Arial, sans-serif;
`;

const Row = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: 1rem;
`;
const RowItem = styled.div`
    margin-left: 1rem;
`;
const Select = styled.select`
    background: #6b6b6b;
    border-radius: 4px;
    color: white;
    padding: 0.4em 0.5em;
    margin-left: 0.25em;
`;
const Button = styled.button`
    border: 0;
    border-radius: 4px;
    cursor: pointer;
    padding: 1em 2em;
`;

export const VideoControls = () => {
    const { callRef } = useCall();

    const [micEnabled, setMicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [screenEnabled, setScreenEnabled] = useState(false);
    const [mediaDevices, setMediaDevices] = useState([]);
    const [cameraDeviceId, setCameraDeviceId] = useState('default');
    const [micDeviceId, setMicDeviceId] = useState('default');

    const toggleMic = (enabled: boolean) => {
        callRef.current.updateParticipant('local', { setAudio: enabled });
        callRef.current.setLocalAudio(enabled);
        setMicEnabled(enabled);
    };

    const toggleVideo = (enabled: boolean) => {
        callRef.current.setLocalVideo(enabled);
        setVideoEnabled(enabled);
    };

    const toggleScreensharing = async (enabled: boolean) => {
        if (enabled) {
            callRef.current.startScreenShare();
        } else {
            callRef.current.stopScreenShare();
        }
        setScreenEnabled(enabled);
    };

    const fetchMediaDevices = async () => {
        const mediaDeviceList = await callRef.current.enumerateDevices();
        setMediaDevices(mediaDeviceList.devices);
    };

    navigator.mediaDevices.ondevicechange = function () {
        fetchMediaDevices();
    };

    useEffect(() => {
        let loop = setInterval(() => {
            if (callRef.current) {
                fetchMediaDevices();
            }
        }, 5000);

        return () => {
            clearInterval(loop);
        };
    }, []);

    useEffect(() => {
        if (callRef.current) {
            fetchMediaDevices();

            // Handle events where a device is disabled outside of our tab.
            callRef.current.on('participant-updated', (event) => {
                if (
                    event.participant.user_id ===
                    callRef.current.participants()['local'].user_id
                ) {
                    if (event.participant.video) {
                        setVideoEnabled(true);
                    } else {
                        setVideoEnabled(false);
                    }

                    if (event.participant.audio) {
                        setMicEnabled(true);
                    } else {
                        setMicEnabled(false);
                    }

                    if (event.participant.screen) {
                        setScreenEnabled(true);
                    } else {
                        setScreenEnabled(false);
                    }
                }
            });
        }
        return () => {
            if (callRef.current) {
                callRef.current.off('participant-updated', () => {});
            }
        };
    }, [callRef.current]);

    useEffect(() => {
        callRef.current?.setInputDevicesAsync({
            videoDeviceId: cameraDeviceId,
            audioDeviceId: micDeviceId,
        });
    }, [cameraDeviceId, micDeviceId]);

    return (
        <VideoControlsContainer>
            <Row>
                <RowItem>
                    Camera:
                    <Select
                        onChange={(e) => setCameraDeviceId(e.target.value)}
                        value={cameraDeviceId}
                    >
                        {mediaDevices &&
                            mediaDevices
                                .filter(
                                    (device) => device.kind === 'videoinput',
                                )
                                .map((device) => (
                                    <option value={device.deviceId}>
                                        {device.label}
                                    </option>
                                ))}
                    </Select>
                </RowItem>

                <RowItem>
                    Mic:
                    <Select
                        onChange={(e) => setMicDeviceId(e.target.value)}
                        value={micDeviceId}
                    >
                        {mediaDevices &&
                            mediaDevices
                                .filter(
                                    (device) => device.kind === 'audioinput',
                                )
                                .map((device) => (
                                    <option value={device.deviceId}>
                                        {device.label}
                                    </option>
                                ))}
                    </Select>
                </RowItem>
            </Row>

            <Row>
                <RowItem>
                    <Button onClick={() => toggleVideo(!videoEnabled)}>
                        {videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
                    </Button>
                </RowItem>

                <RowItem>
                    <Button onClick={() => toggleMic(!micEnabled)}>
                        {micEnabled ? 'Turn Off Mic' : 'Turn On Mic'}
                    </Button>
                </RowItem>

                <RowItem>
                    <Button onClick={() => toggleScreensharing(!screenEnabled)}>
                        {!screenEnabled
                            ? 'Start Screen Sharing'
                            : 'Stop Screen Sharing'}
                    </Button>
                </RowItem>
            </Row>
        </VideoControlsContainer>
    );
};
