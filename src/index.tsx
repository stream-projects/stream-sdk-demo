import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { StreamClubRoot } from 'stream-sdk';
import { Host } from './Host';
import { Cohost } from './Cohost';
import { Player } from './Player';
import { Home } from './Home';
import { IFrame } from './iFrame';

ReactDOM.render(
    <React.StrictMode>
        <StreamClubRoot>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/host">
                        <Host />
                    </Route>
                    <Route path="/cohost">
                        <Cohost />
                    </Route>
                    <Route path="/iframe">
                        <IFrame />
                    </Route>
                    <Route path="/player">
                        <Player />
                    </Route>
                </Switch>
            </Router>
        </StreamClubRoot>
    </React.StrictMode>,
    document.getElementById('root'),
);
