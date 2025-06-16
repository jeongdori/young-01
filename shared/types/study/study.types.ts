import { Prisma, Topic } from "@prisma/client";

export type { Topic };

export type TopicTree = Topic & {
  children: TopicTree[];
};

// export type TopicTree = Omit<Topic, "children" | "parent"> & {
//   children: TopicTree[];
// };

// export type TopicTree = Prisma.TopicGetPayload<{
//   include: {
//     children: true;
//   };
// }>;
