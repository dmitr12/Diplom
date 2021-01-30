import { Component, OnInit } from '@angular/core';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-audioplayer',
  templateUrl: './audioplayer.component.html',
  styleUrls: ['./audioplayer.component.css']
})
export class AudioplayerComponent implements OnInit {

  constructor(public audioService: AudioService) { }

  ngOnInit() {
  }
}
