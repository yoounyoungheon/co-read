import type { Meta, StoryObj } from "@storybook/react";
import Badge from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    tone: {
      control: { type: "select" },
      options: ["slate", "rose", "blue", "zinc", "neutral"],
    },
    variant: {
      control: { type: "select" },
      options: ["solid", "soft", "outline"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    className: {
      control: "text",
    },
  },
  args: {
    children: "Badge",
    tone: "slate",
    variant: "soft",
    size: "md",
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Badge {...args} tone="slate">
        Slate
      </Badge>
      <Badge {...args} tone="rose">
        Rose
      </Badge>
      <Badge {...args} tone="blue">
        Blue
      </Badge>
      <Badge {...args} tone="zinc">
        Zinc
      </Badge>
      <Badge {...args} tone="neutral">
        Neutral
      </Badge>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Badge {...args} variant="solid">
        Solid
      </Badge>
      <Badge {...args} variant="soft">
        Soft
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
    </div>
  ),
  args: {
    tone: "rose",
  },
};
