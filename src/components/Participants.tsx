import { VideoElement } from 'stream-sdk';
import { useCall, useParticipants } from 'stream-sdk';
import styled from 'styled-components';

const ParticipantsContainer = styled.div`
    display: flex;
    align-items: center;
    border-radius: 10px;
    height: 160px;
    max-height: 160px;
    min-height: 160px;
    position: relative;
`;

const ParticipantItem = styled.div`
    margin-left: 1rem;
`;

export const Participants = () => {
    const { callState } = useCall();

    const { participants, enableParticipant, disableParticipant } =
        useParticipants();

    const toggleOnStream = (user_id: string) => {
        if (participants.some((participant) => participant.id === user_id)) {
            disableParticipant(user_id);
        } else {
            enableParticipant(user_id);
        }
    };

    return (
        <ParticipantsContainer>
            {callState?.callItems &&
                Object.entries(callState.callItems).map(([id, participant]) => {
                    return (
                        <ParticipantItem key={id}>
                            <div>{participant.name}</div>
                            <VideoElement
                                srcObject={participant.mediaStream}
                                autoPlay={true}
                                style={{ height: 90 }}
                            ></VideoElement>
                            <br />
                            <button onClick={() => toggleOnStream(id)}>
                                Toggle
                            </button>
                        </ParticipantItem>
                    );
                })}
        </ParticipantsContainer>
    );
};
