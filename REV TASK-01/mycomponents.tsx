// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>This is a reusable component</p>
    </div>
  );
}