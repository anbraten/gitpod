/**
 * Copyright (c) 2020 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import { Workspace } from ".";

export namespace ContextURL {
  export const INCREMENTAL_PREBUILD_PREFIX = "incremental-prebuild";
  export const PREBUILD_PREFIX = "prebuild";
  export const IMAGEBUILD_PREFIX = "imagebuild";
  export const SNAPSHOT_PREFIX = "snapshot";
  export const REFERRER_PREFIX = 'referrer:';

  export function getNormalized(ws: Pick<Workspace, "context" | "contextURL"> | undefined, fallbackToRaw: boolean = true): string | undefined {
    const normalized = normalize(ws);
    if (!normalized && fallbackToRaw) {
      return ws?.contextURL;
    }
    return normalized;
  }

  export function getNormalizedURL(ws: Pick<Workspace, "context" | "contextURL">): URL | undefined {
    const contextURL = normalize(ws);
    if (!contextURL) {
      return undefined;
    }

    try {
      return new URL(contextURL);
    } catch (err) {
      console.error(err);
    }
    return undefined;
  }

  function normalize(ws: Pick<Workspace, "context" | "contextURL"> | undefined): string | undefined {
    if (!ws) {
      return undefined;
    }
    if (ws.context.normalizedContextURL) {
      return ws.context.normalizedContextURL;
    }

    // fallback: we do not yet set normalizedContextURL on all workspaces, yet, let alone older existing workspaces
    try {
      const u = removePrefixes(ws.contextURL);
      if (u) {
        return u;
      }
    } catch (err) {
      console.error(err);
    }

    return undefined;
  }

  /**
   * The field "contextUrl" might contain prefixes like:
   *  - envvar1=value1/...
   *  - prebuild/...
   * This is the analogon to the (Prefix)ContextParser structure in "server".
   */
  function removePrefixes(contextUrl: string | undefined): string | undefined {
    if (contextUrl === undefined) {
      return undefined;
    }

    const segments = contextUrl.split("/");
    if (segments.length === 1) {
      return segments[0];  // this might be something, we just try
    }

    const segmentsToURL = (offset: number): string => {
      let rest = segments.slice(offset).join("/");
      if (!rest.startsWith("http")) {
        rest = 'https://' + rest;
      }
      return rest;
    };


    const firstSegment = segments[0];
    if (firstSegment === PREBUILD_PREFIX ||
        firstSegment === INCREMENTAL_PREBUILD_PREFIX ||
        firstSegment === IMAGEBUILD_PREFIX ||
        firstSegment === SNAPSHOT_PREFIX ||
        firstSegment.startsWith(REFERRER_PREFIX)) {
      return segmentsToURL(1);
    }

    // check for env vars
    if (firstSegment.indexOf("=") !== -1) {
      return segmentsToURL(1);
    }

    return segmentsToURL(0);
  }
}