/**
 * Copyright (c) 2022 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import React, { createContext, useEffect, useState } from 'react';
import { countries } from 'countries-list';
import { Currency } from '@gitpod/gitpod-protocol/lib/plans';
import { getGitpodService } from './service/service';

const PaymentContext = createContext<{
    showPaymentUI?: boolean,
    setShowPaymentUI: React.Dispatch<boolean>,
    currency: Currency,
    setCurrency: React.Dispatch<Currency>,
    isStudent?: boolean,
    setIsStudent: React.Dispatch<boolean>,
    isChargebeeCustomer?: boolean,
    setIsChargebeeCustomer: React.Dispatch<boolean>,
}>({
    setShowPaymentUI: () => null,
    currency: 'USD',
    setCurrency: () => null,
    setIsStudent: () => null,
    setIsChargebeeCustomer: () => null,
});

const PaymentContextProvider: React.FC = ({ children }) => {
    const [ showPaymentUI, setShowPaymentUI ] = useState<boolean>(false);
    const [ currency, setCurrency ] = useState<Currency>('USD');
    const [ isStudent, setIsStudent ] = useState<boolean>();
    const [ isChargebeeCustomer, setIsChargebeeCustomer ] = useState<boolean>();

    useEffect(() => {
        const { server } = getGitpodService();
        Promise.all([
            server.getShowPaymentUI().then(v => () => setShowPaymentUI(v)),
            server.getClientRegion().then(v => () => {
                // @ts-ignore
                setCurrency(countries[v]?.currency === 'EUR' ? 'EUR' : 'USD');
            }),
            server.isStudent().then(v => () => setIsStudent(v)),
            server.isChargebeeCustomer().then(v => () => setIsChargebeeCustomer(v)),
        ]).then(setters => setters.forEach(s => s()));
    }, []);

    return (
        <PaymentContext.Provider value={{
            showPaymentUI,
            setShowPaymentUI,
            currency,
            setCurrency,
            isStudent,
            setIsStudent,
            isChargebeeCustomer,
            setIsChargebeeCustomer,
        }}>
            {children}
        </PaymentContext.Provider>
    )
}

export { PaymentContext, PaymentContextProvider };
