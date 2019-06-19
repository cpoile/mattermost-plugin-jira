// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {openCreateModalWithoutPost, sendEphemeralPost} from '../actions';
import {isUserConnected, isInstanceInstalled} from '../selectors';

export default class Hooks {
    constructor(store) {
        this.store = store;
    }

    slashCommandWillBePostedHook = (message, contextArgs) => {
        if (message && (message.startsWith('/jira create ') || message === '/jira create')) {
            if (!isInstanceInstalled(this.store.getState())) {
                sendEphemeralPost(this.store, 'There is not Jira instance installed. Please contact your system administrator.');
                return Promise.resolve({});
            }
            if (!isUserConnected(this.store.getState())) {
                sendEphemeralPost(this.store, 'Your username is not connected to Jira. Please type `/jira connect`.');
                return Promise.resolve({});
            }
            const description = message.slice(12).trim();
            this.store.dispatch(openCreateModalWithoutPost(description, contextArgs.channel_id));
            return Promise.resolve({});
        }
        return Promise.resolve({message, args: contextArgs});
    }
}
