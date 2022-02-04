/**
 * Copyright (c) 2022 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import { TeamMemberInfo } from "@gitpod/gitpod-protocol";
import { Currency, Plans } from "@gitpod/gitpod-protocol/lib/plans";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { PageWithSubMenu } from "../components/PageWithSubMenu";
import SelectableCard from "../components/SelectableCard";
import { PaymentContext } from "../payment-context";
import { getGitpodService } from "../service/service";
import { getCurrentTeam, TeamsContext } from "./teams-context";
import { getTeamSettingsMenu } from "./TeamSettings";

export default function TeamPlans() {
    const { teams } = useContext(TeamsContext);
    const location = useLocation();
    const team = getCurrentTeam(location, teams);
    const [ members, setMembers ] = useState<TeamMemberInfo[]>([]);
    const { showPaymentUI, currency, setCurrency } = useContext(PaymentContext);

    useEffect(() => {
        if (!team) {
            return;
        }
        (async () => {
            const infos = await getGitpodService().server.getTeamMembers(team.id);
            setMembers(infos);
        })();
    }, [ team ]);

    const availableTeamPlans = Plans.getAvailableTeamPlans(currency || 'USD');

    return <PageWithSubMenu subMenu={getTeamSettingsMenu({ team, showPaymentUI })} title="Plans" subtitle="Manage team plans and billing.">
        <button>Billing</button>
        <span className="pl-6">{currency === 'EUR'
            ? <>€ / <a className="gp-link" href="javascript:void(0)" onClick={() => setCurrency('USD')}>$</a></>
            : <><a className="gp-link" href="javascript:void(0)" onClick={() => setCurrency('EUR')}>€</a> / $</>}
        </span>
        <div className="mt-4 space-x-4 flex">
            <SelectableCard className="w-36 h-32" title="Free" selected={true} onClick={() => {}}>
                {members.length} x {Currency.getSymbol(currency || 'USD')}0 = {Currency.getSymbol(currency || 'USD')}0
            </SelectableCard>
            {availableTeamPlans.map(tp => <SelectableCard className="w-36 h-32" title={tp.name} selected={false} onClick={() => {}}>
                {members.length} x {Currency.getSymbol(tp.currency)}{tp.pricePerMonth} = {Currency.getSymbol(tp.currency)}{members.length * tp.pricePerMonth}
            </SelectableCard>)}
        </div>
    </PageWithSubMenu>;
}
