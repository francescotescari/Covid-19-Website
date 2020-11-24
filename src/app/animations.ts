import {
  trigger,
  animate,
  transition,
  style,
  query, state
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    style({ transform: 'translateX(-100%)'}),
    animate(1000)
  ]),
  transition('* => void', [
    animate(100, style({ transform: 'translateX(100%)' }))
  ])
]);
