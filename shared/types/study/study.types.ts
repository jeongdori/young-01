import { Prisma, Topic } from "@prisma/client";

export type { Topic };

export type TopicAll = {
  id: number;
  parentId: number | null;
  title: string | null;
  sortOrder: number;
  depth: number;
};
export type TopicTree = TopicAll & {
  children: TopicTree[];
};

export type InsertTopic = {
  parentId: number;
  depth: number;
  sortOrder: number;
};

// export type TopicTree = Omit<Topic, "children" | "parent"> & {
//   children: TopicTree[];
// };

// export type TopicTree = Prisma.TopicGetPayload<{
//   include: {
//     children: true;
//   };
// }>;
