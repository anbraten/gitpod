/**
 * Copyright (c) 2020 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import * as chai from 'chai';
import { suite, test } from 'mocha-typescript';
import { Workspace } from '.';
import { ContextURL } from './context-url';
const expect = chai.expect;

@suite
export class ContextUrlTest {

    @test public parseContextUrl_withEnvVar() {
        const actual = ContextURL.getNormalizedURL({ contextURL: "passedin=test%20value/https://github.com/gitpod-io/gitpod-test-repo", context: {} } as Pick<Workspace, "context" | "contextURL">);
        expect(actual?.host).to.equal("github.com");
        expect(actual?.pathname).to.equal("/gitpod-io/gitpod-test-repo");
    }

    @test public parseContextUrl_withEnvVar_withoutSchema() {
        const actual = ContextURL.getNormalizedURL({ contextURL: "passedin=test%20value/github.com/gitpod-io/gitpod-test-repo", context: {} } as Pick<Workspace, "context" | "contextURL">);
        expect(actual?.host).to.equal("github.com");
        expect(actual?.pathname).to.equal("/gitpod-io/gitpod-test-repo");
    }

    @test public parseContextUrl_withPrebuild() {
        const actual = ContextURL.getNormalizedURL({ contextURL: "prebuild/https://github.com/gitpod-io/gitpod-test-repo", context: {} } as Pick<Workspace, "context" | "contextURL">);
        expect(actual?.host).to.equal("github.com");
        expect(actual?.pathname).to.equal("/gitpod-io/gitpod-test-repo");
    }

    @test public parseContextUrl_withPrebuild_withoutSchema() {
        const actual = ContextURL.getNormalizedURL({ contextURL: "prebuild/github.com/gitpod-io/gitpod-test-repo", context: {} } as Pick<Workspace, "context" | "contextURL">);
        expect(actual?.host).to.equal("github.com");
        expect(actual?.pathname).to.equal("/gitpod-io/gitpod-test-repo");
    }
}
module.exports = new ContextUrlTest()