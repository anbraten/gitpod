/**
 * Copyright (c) 2020 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import { ContainerModule } from "inversify";
import { AuthProvider } from "../auth/auth-provider";
import { BitbucketApiFactory } from '../bitbucket/bitbucket-api-factory';
import { BitbucketContextParser } from "../bitbucket/bitbucket-context-parser";
import { BitbucketFileProvider } from "../bitbucket/bitbucket-file-provider";
import { BitbucketLanguagesProvider } from "../bitbucket/bitbucket-language-provider";
import { BitbucketRepositoryProvider } from "../bitbucket/bitbucket-repository-provider";
import { BitbucketTokenHelper } from "../bitbucket/bitbucket-token-handler";
import { FileProvider, LanguagesProvider, RepositoryHost, RepositoryProvider } from "../repohost";
import { IContextParser } from "../workspace/context-parser";
import { BitbucketServerAuthProvider } from "./bitbucket-server-auth-provider";

export const bitbucketServerContainerModule = new ContainerModule((bind, _unbind, _isBound, _rebind) => {
    bind(RepositoryHost).toSelf().inSingletonScope();
    bind(BitbucketApiFactory).toSelf().inSingletonScope();
    bind(BitbucketFileProvider).toSelf().inSingletonScope();
    bind(FileProvider).toService(BitbucketFileProvider);
    bind(BitbucketContextParser).toSelf().inSingletonScope();
    bind(BitbucketLanguagesProvider).toSelf().inSingletonScope();
    bind(LanguagesProvider).toService(BitbucketLanguagesProvider);
    bind(IContextParser).toService(BitbucketContextParser);
    bind(BitbucketRepositoryProvider).toSelf().inSingletonScope();
    bind(RepositoryProvider).toService(BitbucketRepositoryProvider);
    bind(BitbucketServerAuthProvider).toSelf().inSingletonScope();
    bind(AuthProvider).to(BitbucketServerAuthProvider).inSingletonScope();
    bind(BitbucketTokenHelper).toSelf().inSingletonScope();
    // bind(BitbucketTokenValidator).toSelf().inSingletonScope(); // TODO
    // bind(IGitTokenValidator).toService(BitbucketTokenValidator);
});
