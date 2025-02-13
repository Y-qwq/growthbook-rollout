import { GrowthBook, VariationRange } from "@growthbook/growthbook"

export function isIncludedInRollout(key: string, value: string, range: VariationRange) {
  const hashAttribute = 'hashAttribute'
  return new GrowthBook({
    attributes: {
      [hashAttribute]: value,
    },
    features: {
      [key]: {
        rules: [{
          force: true,
          hashAttribute,
          range,
        }]
      }
    }
  }).isOn(key)
}
