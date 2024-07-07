import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, inject } from "@angular/core";

@Component({
  selector: '$selector',
  template: `
  $template
  `,
  standalone: true,
  imports: [CommonModule]
})
export class $classNameComponent implements OnChanges, AfterViewInit{
  @Input() class?: string;
  private _el: ElementRef<HTMLElement>;

  constructor() {
    this._el = inject(ElementRef);
  }

  private updateClass(previousClass?: string){
    const svg = this._el.nativeElement.querySelector('svg');

    if(svg){
      if(this.class){
        svg.classList.add(...this.class.split(" "));

        if(previousClass){
          svg.classList.remove(...previousClass.split(" "));
        }

        this._el.nativeElement.classList.remove(...this.class.split(" "))
      }
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes['class']) {
      const previous = changes['class'].previousValue;
      this.updateClass(previous);
    }
  }

  public ngAfterViewInit(): void {
    this.updateClass();
  }
}
