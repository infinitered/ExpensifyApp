type PolicyTag = {
    /** Name of a Tag */
    name: string;

    /** Flag that determines if a tag is active and able to be selected */
    enabled: boolean;

    /** "General Ledger code" that corresponds to this tag in an accounting system. Similar to an ID. */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'GL Code': string;

    /** Nested tags */
    tags: PolicyTags;
};

type PolicyTags = Record<string, PolicyTag>;

type PolicyTagList<T extends string = string> = Record<
    T,
    {
        /** Name of the tag list */
        name: T;

        /** Flag that determines if tags are required */
        required: boolean;

        tags: PolicyTags;
    }
>;

export type {PolicyTag, PolicyTags, PolicyTagList};
