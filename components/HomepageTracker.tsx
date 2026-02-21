'use client';

import { useEffect } from "react";
import posthog from "posthog-js";

const HomepageTracker = () => {
    useEffect(() => {
        posthog.capture('homepage_viewed', {
            featured_events_count: 6,
        });
    }, []);

    return null;
};

export default HomepageTracker;
