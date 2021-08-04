import { useAssets } from 'stream-sdk';
import { createAsset, getAssets, deleteAsset } from 'stream-sdk';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;
const Form = styled.form`
    box-sizing: border-box;
    width: 100%;
`;

const SecondaryButton = styled.button`
    background: white;
    border: 0;
    border: 1px solid #704cf1;
    border-radius: 4px;
    color: #704cf1;
    cursor: pointer;
    margin-top: 0.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.75rem;
    width: 100%;
    transition: 0.1s easeOut;

    &:hover {
        border-width: 3px;
        // background: #704CF1;
        // color: white;
    }
`;

const Input = styled.input`
    box-sizing: border-box;
    border-radius: 3px;
    border: 1px solid gray;
    display: block;
    font-size: 0.85rem;
    padding: 0.75em;
    width: 100%;

    &:not(:first-child) {
        margin-top: 0.5em;
    }
`;
const AssetResultContainer = styled.div`
    font-family: Arial, sans-serif;
    margin-top: 1.5rem;
`;
const AssetResultContainerTitle = styled.div`
    margin-top: 1rem;
    text-align: center;
`;

const AssetContainer = styled.div`
    margin-top: 1rem;
`;
const AssetTitle = styled.div`
    font-size: 0.85rem;
`;

const AssetButton = styled.button`
    background: white;
    border: 0;
    border: 1px solid #704cf1;
    border-radius: 4px;
    color: #704cf1;
    cursor: pointer;
    margin-top: 0.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
    width: 100%;
    transition: 0.1s easeOut;

    &:hover {
        border-width: 3px;
    }
`;

export const Assets = ({ liveStreamId, token }) => {
    const { assets, enableAsset, disableAsset } = useAssets();
    const [createdAssets, setCreatedAssets] = useState([]);

    useEffect(() => {
        updateAssetList();
    }, []);

    const updateAssetList = async () => {
        const result = await getAssets(liveStreamId, token);
        setCreatedAssets(() => {
            return [...result];
        });
    };

    // This is a very simple implementation, we reccomend uploading assets to s3 and detecting sizes.
    const createNewAsset = async (e) => {
        e.preventDefault();
        const attributes: any = {};
        const url = (document.getElementById('create-asset-input') as any)
            .value;
        if (url) {
            try {
                let validUrl = new URL(url);
                attributes.src = validUrl;
            } catch (error) {
                alert('Invalid asset url!');
                return;
            }
        }
        const height = (document.getElementById('create-asset-height') as any)
            .value;
        if (url && height) {
            attributes.height = height;
        } else if (url) {
            attributes.height = 200;
        }

        const width = (document.getElementById('create-asset-width') as any)
            .value;
        if (url && width) {
            attributes.width = width;
        } else if (url) {
            attributes.width = 200;
        }

        const type =
            (document.getElementById('create-asset-type') as any).value ??
            'LOGO_OVERLAY';

        // Logo overlay is hard coded here. It should change based on the type of asset uploaded.
        await createAsset(liveStreamId, token, attributes, type);
        await updateAssetList();
    };

    return (
        <Container>
            <Form onSubmit={createNewAsset}>
                <Input id="create-asset-input" type="text" placeholder="URL" />

                <Input
                    id="create-asset-height"
                    type="text"
                    placeholder="height"
                />
                <Input
                    id="create-asset-width"
                    type="text"
                    placeholder="width"
                />
                <Input id="create-asset-type" type="text" placeholder="type" />
                <SecondaryButton>Create Asset</SecondaryButton>
            </Form>
            <AssetResultContainer>
                <AssetResultContainerTitle>Assets</AssetResultContainerTitle>
                {createdAssets.map((asset) => {
                    return (
                        <AssetContainer>
                            <AssetTitle>Asset {asset.type}</AssetTitle>
                            <AssetButton onClick={() => enableAsset(asset.id)}>
                                Show Asset
                            </AssetButton>
                            <AssetButton onClick={() => disableAsset(asset.id)}>
                                Hide Asset
                            </AssetButton>

                            <AssetButton
                                onClick={async () => {
                                    await deleteAsset(
                                        liveStreamId,
                                        token,
                                        asset.id,
                                    );
                                    updateAssetList();
                                }}
                            >
                                Delete Asset
                            </AssetButton>
                        </AssetContainer>
                    );
                })}
            </AssetResultContainer>
        </Container>
    );
};
