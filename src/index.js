import { getUrl, checkAvailableAssets, checkParams } from './helpers';
import axios from 'axios';
import base64 from 'base-64'
import availableAssetsOnMethods from './availableAssets'


export default (host, port, protocol, token) => {

    const baseUrl = getUrl(host, port, protocol);
    const apiUrl = `${baseUrl}/api`;



    const username = 'Administrator';
    const password = 'Password1';
    const auth = 'not-token';
    const basicEncoded = base64.encode(`${username}:${password}`);
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: auth === 'token' ? `Token ${token}` : `Basic ${basicEncoded}`
    };

    let ajax = axios.create({
        baseURL: baseUrl,
        timeout: 1000,
        headers: headers
    });

    let expo = (asset, attributes) => {
        checkAvailableAssets('export', asset, availableAssetsOnMethods['expo']);
        let exportEndpoint = `${apiUrl}/export_`;
        const expo = {
            pipeline() {
                const requiredParams = ['pipeline'];
                return { body: { ...attributes }, endpoint: `${exportEndpoint}${asset}` }
            },
            project() {
                const requiredParams = ['project'];
                return { body: { ...attributes }, endpoint: `${exportEndpoint}${asset}` }
            },
        };

        const request = expo[asset]();
        return ajax.post(request.endpoint, request.body);
    };

    let read = (asset, attributes) => {
        checkAvailableAssets('read', asset, availableAssetsOnMethods['read']);
        // let listEndpoint = `${apiUrl}/list_`;
        let getEndpoint = `${apiUrl}/get_`;

        const read = {
            __getPiRelated() {
                const requiredParams = ['pi'];
                checkParams(asset, attributes, requiredParams);
                return { body: { ...attributes }, endpoint: `${getEndpoint}${asset}` }
            },
            token() {
                return { body: {}, endpoint: `${getEndpoint}${asset}` }
            },
            system_log() {
                return {
                    body: { ...attributes },
                    endpoint: `${getEndpoint}${asset}`
                }
            },
            settings() {
                return { body: { ...attributes }, endpoint: `${getEndpoint}${asset}` }
            },
            worklist() {
                return { body: { ...attributes }, endpoint: `${getEndpoint}${asset}` }
            },
            pipeline() {
                const requiredParams = ['pipeline'];
                checkParams(asset, attributes, requiredParams);
                return { body: { ...attributes }, endpoint: `${getEndpoint}${asset}` }
            },
            pipelineinstance() {
                return this.__getPiRelated()
            },
            pi_workitems() {
                return this.__getPiRelated()
            },
            pi_data() {
                return this.__getPiRelated()
            },
            pi_changes() {
                return this.__getPiRelated()
            },
            pi_artifacts() {
                return this.__getPiRelated()
            },

        };

        const request = read[asset]();
        return ajax.post(request.endpoint, request.body);
    };

    let update = (asset, attributes) => {
        checkAvailableAssets('update', asset, availableAssetsOnMethods['update']);
        let updateEndpoint = `${apiUrl}/update_`;

        const update = {
            cloud() {
                const requiredParams = ['name'];
                checkParams(asset, attributes, requiredParams);

                const body = Object.keys(attributes).reduce((acc, cur) => {
                    if (attributes[cur]) { acc[cur] = attributes[cur] }
                    return acc
                }, {});

                return {
                    body,
                    endpoint: `${updateEndpoint}${asset}`
                }
            },
            user() {
                const requiredParams = ['user'];
                checkParams(asset, attributes, requiredParams);
                return {
                    body: { ...attributes },
                    endpoint: `${updateEndpoint}${asset}`
                }
            }
        };

        const request = update[asset]();
        return ajax.post(request.endpoint, request.body);
    };

    let create = (asset, attributes) => {
        checkAvailableAssets('create', asset, availableAssetsOnMethods['create']);
        let createEndpoint = `${apiUrl}/create_`;

        const create = {
            project() {
                const requiredParams = ['name'];
                checkParams(asset, attributes, requiredParams);
                return {
                    body: { ...attributes },
                    endpoint: `${createEndpoint}${asset}`
                }
            },
            asset() {
                const requiredParams = ['name'];
                checkParams(asset, attributes, requiredParams);
                return {
                    body: { ...attributes },
                    endpoint: `${createEndpoint}${asset}`
                }
            },
            cloud() {
                const requiredParams = ['name', 'provider', 'apiUrl', 'apiProtocol'];
                checkParams(asset, attributes, requiredParams);
                return {
                    body: {
                        apiurl: attributes.apiUrl,
                        apiprotocol: attributes.apiProtocol,
                        ...attributes
                    },
                    endpoint: `${createEndpoint}${asset}`
                }
            },
            account() {
                const requiredParams = ['name', 'provider', 'login', 'password', 'defaultCloud'];
                checkParams(asset, attributes, requiredParams);
                return {
                    body: {
                        default_cloud: attributes.defaultCloud,
                        ...attributes
                    },
                    endpoint: `${createEndpoint}${asset}`
                }
            },
            credential() {
                const requiredParams = ['name', 'username', 'password'];
                checkParams(asset, attributes, requiredParams);
                return {
                    body: { ...attributes },
                    endpoint: `${createEndpoint}${asset}`
                }
            },
            tag() {
                const requiredParams = ['name'];
                checkParams(asset, attributes, requiredParams);
                return {
                    body: { ...attributes },
                    endpoint: `${createEndpoint}${asset}`
                }
            },
            user() {
                const requiredParams = ['user', 'name', 'role'];
                checkParams(asset, attributes, requiredParams);
                return {
                    body: { ...attributes },
                    endpoint: `${createEndpoint}${asset}`
                }
            }
        };

        const request = create[asset]();
        return ajax.post(request.endpoint, request.body);
    };

    return {
        create,
        update,
        read,
        expo
    }
}