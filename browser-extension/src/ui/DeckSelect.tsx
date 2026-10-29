import { Field } from "@base-ui/react/field";
import { Select } from "@base-ui/react/select";

interface DeckSelectProps {
  decks: string[];
  value: string;
  onValueChange: (deck: string) => void;
}

export function DeckSelect({ decks, value, onValueChange }: DeckSelectProps) {
  return (
    <Field.Root className="field" name="deck">
      <Select.Root
        items={decks.map((deck) => ({ label: deck, value: deck }))}
        value={value}
        onValueChange={(deck) => deck && onValueChange(deck)}
      >
        <Select.Label className="field__label">Deck</Select.Label>
        <Select.Trigger className="select__trigger">
          <Select.Value />
          <Select.Icon>▾</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="select__positioner" sideOffset={4}>
            <Select.Popup className="select__popup">
              <Select.List>
                {decks.map((deck) => (
                  <Select.Item key={deck} value={deck} className="select__item">
                    <Select.ItemIndicator className="select__check">
                      ✓
                    </Select.ItemIndicator>
                    <Select.ItemText>{deck}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  );
}
