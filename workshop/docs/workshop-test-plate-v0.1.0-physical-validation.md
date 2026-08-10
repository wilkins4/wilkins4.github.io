# Workshop Test Plate v0.1.0 Physical Validation

## Release decision

Do not mark v0.1.0 production-ready until this checklist is complete.

- No geometry change needed: promote the same geometry to v1.0.0 with final photographs and validated settings.
- Geometry or documentation change needed: release v0.1.1, print it again, and repeat the affected checks.

## 1. Printer readiness

- [ ] Replace and tension the Saturn release film.
- [ ] Inspect the film for dents, clouding, loose edges, and debris.
- [ ] Confirm the build plate is clean, secure, and correctly leveled.
- [ ] Confirm the vat and screen are clean.
- [ ] Confirm ventilation, nitrile gloves, eye protection, wash station, and curing station are ready.

## 2. Record the exact test conditions

- Printer:
- Slicer and version:
- Resin brand and exact product:
- Resin batch or bottle date:
- Resin mixture ratio:
- Room temperature:
- Layer height:
- Normal exposure:
- Bottom exposure:
- Bottom layers:
- Transition layers:
- Lift distance:
- Lift speed:
- Retract speed:
- Anti-aliasing setting:
- Orientation:
- Supports used:
- Start date and time:

Recommended first comparison: print flat, feature side up, using 0.05 mm layers and an already functional resin profile. Change only one variable between comparison prints.

## 3. Before printing

- [ ] Import size reads 60 x 40 x 2.8 mm.
- [ ] The model is not automatically rescaled.
- [ ] The feature side is facing up.
- [ ] The entire plate is inside the printable area.
- [ ] Island and layer preview review is complete.
- [ ] The sliced file is saved with printer, resin, layer height, and exposure in the filename.

## 4. Print result

- [ ] Plate adhered completely.
- [ ] No partial separation or peeling.
- [ ] No missing regions.
- [ ] No visible layer shifts.
- [ ] No major warping before wash.
- [ ] Print duration recorded.
- [ ] Resin consumption recorded.

Observed failures:


## 5. Wash and cure

- Wash method:
- Wash fluid:
- Wash duration:
- Dry duration before cure:
- Cure station:
- Cure duration:
- Cure orientation:

- [ ] Print was fully dry before curing.
- [ ] No uncured resin remains in recessed features.
- [ ] The plate did not visibly warp during curing.

## 6. Measurement checks

Record measurements after full cure.

| Measurement | Nominal | Actual | Pass or fail |
| --- | ---: | ---: | --- |
| Overall width | 60.00 mm |  |  |
| Overall depth | 40.00 mm |  |  |
| Maximum height | 2.80 mm |  |  |
| Base thickness in unchanged area | 2.00 mm |  |  |

Initial dimensional target for the beta: overall width and depth within plus or minus 0.30 mm, no rocking on a flat surface, and no visible corner lift. Tighten this target only after more than one printer and resin profile have been tested.

## 7. Feature inspection

### Raised lines

Mark the smallest clean, continuous line.

- 0.20 mm:
- 0.35 mm:
- 0.50 mm:
- 0.70 mm:
- 1.00 mm:

### Recessed grooves

Mark the smallest groove that remains visibly open after wash and cure.

- 0.20 mm:
- 0.35 mm:
- 0.50 mm:
- 0.70 mm:
- 1.00 mm:

### Square posts and recesses

Record whether each post is intact and each recess is open.

- 0.50 mm:
- 0.70 mm:
- 0.90 mm:
- 1.20 mm:
- 1.50 mm:

### Relief steps

- 0.10 mm remains visible:
- 0.40 mm remains distinct:
- 0.80 mm remains distinct:

### Texture fields

- Parallel lines:
- Grid:
- Rivets:
- Checker field:

## 8. Durability checks

Use a fully cured print.

- [ ] Plate survives normal handling without cracking.
- [ ] Thin raised details survive a light fingernail pass.
- [ ] Corners do not chip during ordinary handling.
- [ ] A controlled waist-height drop onto a protected hard surface is documented, if safe to perform.
- [ ] Any brittleness or flex is recorded.

## 9. Required photographs

- [ ] Printed plate before wash.
- [ ] Printed plate after wash and before cure.
- [ ] Final top view.
- [ ] Low-angle view showing relief.
- [ ] Macro view of raised lines and grooves.
- [ ] Macro view of posts and recesses.
- [ ] Macro view of texture fields.
- [ ] Caliper measurement of width.
- [ ] Caliper measurement of depth.
- [ ] Any failed or damaged feature.

Use a neutral background, diffuse light, fixed camera position, and no smoothing or editing that hides defects.

## 10. Final disposition

- [ ] Pass without geometry changes.
- [ ] Pass with documentation changes only.
- [ ] Revise geometry and release v0.1.1.
- [ ] Revise resin or slicer profile and repeat v0.1.0.
- [ ] Reject the current design.

Required changes:


Validated by:

Validation date:
