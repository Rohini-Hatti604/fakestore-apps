
import { create } from 'zustand';
import type { RuleGroupType } from 'react-querybuilder';

interface FilterState {
  filters: RuleGroupType;
  setFilters: (filters: RuleGroupType) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: { combinator: 'and', rules: [] },
  setFilters: (filters) => set({ filters }),
}));
